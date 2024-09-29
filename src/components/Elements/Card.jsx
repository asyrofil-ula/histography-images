// import Footer from "../layouts/Footer";
const Card = (props) => {
  const { children } = props;
  return (
    <div className="card mt-5 mx-auto w-50 p-5 bg-white text-100 mx-auto text-primary-content shadow-xxl">
      {children}
    </div>
  );
};

const Header = (props) => {
  const { title, description, children } = props;
  return (
    <div className="card mt-5 mx-auto w-50 p-5 bg-white text-100 mx-auto text-primary-content shadow-xxl">
    <div className="card-header text-black">
      <h2 className="card-title justify-center font-bold">{title}</h2>
      <p className="mb-8">{description}</p>
      <div className="card-body">
        <div className="card-actions justify-center mt-4 gap-8">{children}</div>
      </div>
    </div>    

    </div>
  );
};

Card.Header = Header;

export default Card;
