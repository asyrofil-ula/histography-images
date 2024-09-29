import Footer from "../layouts/Footer";
import Button from "./Button";

const Modal = (props) => {
  const { children, id } = props;
  return (
    <>
      <dialog id={id} className="modal">
        {children}
      </dialog>
    </>
  );
};

const Body = (props) => {
  const { children, title, closeModal } = props;
  return (
      <div className="modal-box bg-white text-100 w-11/12 max-w-5xl">
        <form method="dialog">
          <Button classname="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</Button>
        </form>
        <h1 className="font-bold text-lg">{title}</h1>
        <p className="py-4">{children}</p>
        <Footer/>
      </div>
  );
};

Modal.Body = Body;

export default Modal;
