import Swal from "sweetalert2";

const toastAlert = (title, icon) => {
  Swal.fire({
    title: title,
    icon: icon,
    position: "bottom-end",
    timer: 3000,
    toast: true,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

export { toastAlert };
export default toastAlert;
