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
