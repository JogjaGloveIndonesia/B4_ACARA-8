(function () {
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
    data.append("_subject", "Pesan website: " + form.subject.value);
    data.append("_template", "table");
    data.append("_captcha", "false");

    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    })
      .then(function (r) {
        return r.text().then(function (t) {
          var j;
          try { j = JSON.parse(t); } catch (err) { j = { message: "Respon bukan JSON" }; }
          return { ok: r.ok, status: r.status, body: j };
        });
      })
      .then(function (res) {
        show(loading, false);
        button.disabled = false;
        if (res.ok && String(res.body.success) === "true") {
          show(sentBox, true);
          form.reset();
        } else {
          throw new Error("Kode " + res.status + ": " + (res.body.message || "tidak ada keterangan"));
        }
      })
      .catch(function (err) {
        show(loading, false);
        button.disabled = false;
        errorBox.textContent = "Pesan belum terkirim. " + err.message;
        show(errorBox, true);
        console.error(err);
      });
  });
})();