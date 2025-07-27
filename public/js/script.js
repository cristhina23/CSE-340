

setTimeout(() => {
    const notice = document.querySelector('.notice');
    if (notice) {
      notice.style.transition = "opacity 0.5s ease-out";
      notice.style.opacity = "0";
      setTimeout(() => notice.remove(), 500);
    }
  }, 3000); // 3 seconds


document.addEventListener("DOMContentLoaded", function () {
  const iconeye = document.querySelector("#togglePassword");
  const password = document.querySelector("#account_password");

  if (iconeye) {
    iconeye.addEventListener("click", function () {
      if (iconeye.src.includes("close-eye.svg")) {
        iconeye.src = "/images/site/open-eye.svg";
        password.type = "text";
      } else {
        iconeye.src = "/images/site/close-eye.svg";
        password.type = "password";
      }
    });
  }
});
 
