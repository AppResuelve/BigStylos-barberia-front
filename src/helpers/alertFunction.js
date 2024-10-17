import Swal from "sweetalert2";
import { useMediaQueryHook } from "../components/interfazMUI/useMediaQuery";
const { xs, sm, md, lg, xl } = useMediaQueryHook();

const toastAlert = (title, icon) => {
  Swal.fire({
    title: title,
    icon: icon,
    position: "bottom-end",
    timer: 3000,
    toast: true,
    width: sm ? "100%" : "",
    showConfirmButton: false,
    showCloseButton: true,
  });
};

export { toastAlert };
export default toastAlert;


// Swal.fire({
//   title: "Estas a punto de cancelar el turno, deseas continuar?",
//   icon: "error",
//   showDenyButton: true,
//   denyButtonText: "Descartar",
//   confirmButtonText: "Continuar",
//   reverseButtons: true,
//   backdrop: `rgba(0,0,0,0.8)`,
//   customClass: {
//     backdrop: "custom-backdrop-swal",
//     container: "custom-swal-container",
//     popup: "custom-swal-modal",
//     htmlContainer: "custom-swal-body",
//     actions: "swal2-actions",
//     confirmButton: "custom-confirm-button-error",
//     denyButton: "custom-deny-button-error",
//     icon: "custom-icon-swal",
//   },
// });