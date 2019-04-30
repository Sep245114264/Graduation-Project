import socket, datetime, sqlite3, threading, queue, json, mmap, contextlib, time
key = "19961113"

class Device():
    def __init__(self, data, connection):
        self.conn = connection
        string = bytes.decode(data)[:-2].split('_')    # 切除wifi模块发送时，自带的回车换行符\r\n
        self.deviceKey = string[0]
        self.deviceID = "system_" + string[1]
        print(self.deviceID)

    def logDevice(self):
        if self.deviceKey != key:
            self.logout()
            return
        print("connect to database...")
        self.db = DataBase('smartHome.db')
        self.db.connect() 
        print("connect success")
        self.db.getCursor()
        print("get cursor success")

    def receiveData(self):
        infoDict = self._parseData(self.conn.recv(1024))
        self.db.insert(self.deviceID, infoDict)
        print("data write success")
        print(infoDict)
    
    def sendData(self, data):
        self.conn.sendall(data)

    def _parseData(self, data):
        if not data:
            self.logout()
            return
        data = self._byteToList(data)
        return {
            'dataTime': str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            'humidity': data[1] + '.' + data[2],
            'temperature': data[3] + '.' + data[4],
            'lux': str(255 - int(data[5])),
            'concentration': data[6],
        }

    def _byteToList(self, byteStr):
        string = list(byteStr)
        parseRes = []
        for i in string:
            parseRes.append( str(i) )
        return parseRes

    def logout(self):
        print("Device %s logout" % self.deviceID)
        self.conn.close()   

class DataBase():
    def __init__(self, databaseName):
        self.name = databaseName

    def connect(self):
        self.connection =  sqlite3.connect(self.name)

    def getCursor(self):
        self.cursor = self.connection.cursor()
    
    def insert(self,tableName, dataDict):
        sqlTag = ''
        sqlValue = ''
        for item in dataDict:
            sqlTag += item + ','
            sqlValue += "\'" + dataDict[item] + "\'" + ','
        sqlTag = sqlTag[:-1]        # 去除额外的逗号
        sqlValue = sqlValue[:-1]    # 去除额外的逗号

        sqlString = "insert into " + tableName + " (" + sqlTag + ") " + "values (" + sqlValue + ")"
        self.cursor.execute(sqlString)
        self.connection.commit()

    def close(self):
        self.connection.close()

def sendDataToMCU(queue):
    currentOrder = 0
    while True:
        with open('/home/sep/website/smartHome/global.dat', 'r') as f:
            with contextlib.closing(mmap.mmap(f.fileno(), 1024, access=mmap.ACCESS_READ)) as m:
                s = m.readline()
                receData = json.loads(s.decode('UTF-8'))
                if currentOrder != receData['order']:
                    currentOrder = receData['order']
                    queue.put(receData['order'])
                time.sleep(1)

HOST = "45.78.59.168"
PORT = 8086

sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sk.bind((HOST, PORT))
sk.listen(1)
conn, addr = sk.accept()

print("Connect from ", addr)
data = conn.recv(1024)          # 获取设备的验证信息
print(data)
device = Device(data, conn)     # 在服务器中注册设备
device.logDevice()

q = queue.Queue()

t = threading.Thread(target=sendDataToMCU, args=(q,))
t.start()

while True:
    # 对收到的数据进行处理，再放到数据库中
    device.receiveData()
    # 如果有数据需要发送，读取websocket group中的数据
    
    # 将控制数据发送给wifi模块
    if not q.empty():
        print('send success')
        data = q.get()
        print(data)
        device.sendData(bytes(data, encoding='UTF-8');
device.logout()

