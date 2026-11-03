/* Kirim form kontak ke email lewat FormSubmit (https://formsubmit.co) */
(function () {
  var EMAIL = "setyadika966@gmail.com";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var loading = form.querySelector(".loading");
  var errorBox = form.querySelector(".error-message");
  var sentBox = form.querySelector(".sent-message");
  var button = form.querySelector('button[type="submit"]');

  function show(el, on) { el.style.display = on ? "block" : "none"; }

  // Link cadangan: membuka aplikasi email dengan isi pesan sudah terisi
  function mailtoLink() {
    var subject = encodeURIComponent("Pesan website: " + form.subject.value);
    var body = encodeURIComponent(
      "Nama: " + form.name.value + "\nEmail: " + form.email.value + "\n\n" + form.message.value
    );
    return "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
  }

  function showError(text, withMailto) {
    errorBox.textContent = text;
    if (withMailto) {
      errorBox.appendChild(document.createElement("br"));
      var a = document.createElement("a");
      a.href = mailtoLink();
      a.textContent = "Klik di sini untuk mengirim lewat aplikasi email";
      a.style.color = "#fff";
      a.style.textDecoration = "underline";
      errorBox.appendChild(a);
    }
    show(errorBox, true);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    show(errorBox, false); show(sentBox, false);

    // FormSubmit tidak bisa dipakai jika halaman dibuka langsung dari file (file:///)
    if (location.protocol === "file:") {
      showError("Halaman ini dibuka langsung dari file. Buka lewat Live Server / localhost atau setelah website online agar form bisa mengirim.", true);
      return;
    }

    show(loading, true);
    button.disabled = true;

    var data = new FormData(form);
    data.append("_subject", "Pesan website: " + form.subject.value);
    data.append("_template", "table");
    data.append("_captcha", "false");

    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    })
      .then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, body: j }; });
      })
      .then(function (res) {
        show(loading, false);
        button.disabled = false;
        if (res.ok && String(res.body.success) === "true") {
          show(sentBox, true);
          form.reset();
        } else {
          // Biasanya: email belum diaktivasi lewat email dari FormSubmit
          showError((res.body && res.body.message) ? res.body.message : "Gagal mengirim pesan.", true);
        }
      })
      .catch(function (err) {
        show(loading, false);
        button.disabled = false;
        showError("Pesan belum terkirim (koneksi ke layanan pengirim gagal). Periksa internet / matikan ad blocker, atau kirim langsung ke " + EMAIL + ".", true);
        console.error(err);
      });
  });
})();