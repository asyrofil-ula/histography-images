/* eslint-disable react/prop-types */
const Option = (props) => {
  const { children, href, role="button", classname="btn-block bg-success hover:bg-success-focus" } = props;
  return (
    <a
      role={role}
      href={href}
      className={`btn ${classname} px-8 py-4`}
    >
      {children}
    </a>
  );
};
export default Option;
