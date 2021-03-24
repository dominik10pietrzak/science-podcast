export const activatePastePermission = () => {
  const comments = document.querySelectorAll('.comment-content-text');
  comments.forEach((comment) => {
    (comment as HTMLElement).addEventListener('paste', function (e: any) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain');

      document.execCommand('insertHTML', false, text);
    });
  });
};
