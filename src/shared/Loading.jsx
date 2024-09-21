import { PropagateLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center my-36 items-center">
        <PropagateLoader
          color="#6366F1"
          // size={100}
        />
      </div>
    </div>
  );
};

export default Loading;
