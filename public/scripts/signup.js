// Newsletter signup — submit to Buttondown in the background so the
// visitor stays on the page. The plain form action remains as the
// no-JS fallback (it navigates to Buttondown's confirmation page).
(function () {
  var form = document.querySelector('.newsletter-form');
  if (!form) return;
  var status = document.querySelector('.newsletter-status');
  var button = form.querySelector('.newsletter-button');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    status.textContent = '';
    status.className = 'newsletter-status';

    fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams(new FormData(form)),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(function (res) {
        if (!res.ok) throw new Error('subscribe failed: ' + res.status);
        status.textContent = 'CHECK YOUR INBOX TO CONFIRM';
        status.classList.add('newsletter-status--ok');
        form.reset();
      })
      .catch(function () {
        status.textContent = 'SOMETHING WENT WRONG — TRY AGAIN';
        status.classList.add('newsletter-status--err');
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
