/* Kirim form kontak ke email lewat Web3Forms */
(function () {
  var ACCESS_KEY = "95f0c32b-e944-4862-b122-d75c7215066d";
  var EMAIL = "setyadika966@gmail.com";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var loading = form.querySelector(".loading");
  var errorBox = form.querySelector(".error-message");
  var sentBox = form.querySelector(".sent-message");
  var button = form.querySelector('button[type="submit"]');

  function show(el, on) { el.style.display = on ? "block" : "none"; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    show(errorBox, false); show(sentBox, false); show(loading, true);
    button.disabled = true;

    var data = new FormData(form);
    data.append("access_key", ACCESS_KEY);
    data.append("subject", "Pesan website: " + form.subject.value);
    data.append("from_name", "Website PT Jogja Glove Indonesia");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        show(loading, false);
        button.disabled = false;
        if (res.success) {
          show(sentBox, true);
          form.reset();
        } else {
          throw new Error(res.message || "Gagal mengirim pesan.");
        }
      })
      .catch(function (err) {
        show(loading, false);
        button.disabled = false;
        var mailto = "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(form.subject.value) +
          "&body=" + encodeURIComponent(form.message.value + "\n\n" + form.name.value + " (" + form.email.value + ")");
        errorBox.innerHTML = "Pesan belum terkirim. Periksa internet / matikan ad blocker, atau kirim langsung ke " +
          EMAIL + ". <br><a href=\"" + mailto + "\">Klik di sini untuk mengirim lewat aplikasi email</a>";
        show(errorBox, true);
        console.error(err);
      });
  });
})();