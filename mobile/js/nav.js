!function()
{
  let node = document.querySelector('.nav-icon');
  let navNode = document.querySelector('.nav-menu');
  node.addEventListener('click', (e) => {
    e.stopPropagation();
    navNode.className.indexOf('collapse') !== -1 ? navNode.classList.remove('collapse') : navNode.classList.add('collapse');
  })
  document.addEventListener('click', () => {
    navNode.className.indexOf('collapse') !== -1 && navNode.classList.remove('collapse');
  })
}()