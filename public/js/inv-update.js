 document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#updateForm");
    const updateBtn = document.querySelector("button[type='submit']");

    form.addEventListener("change", function () {
      updateBtn.removeAttribute("disabled");
    });
  });