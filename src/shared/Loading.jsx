import { FadeLoader } from "react-spinners";

const Loading = () => {
  return (
    <div>
      <div className="flex justify-center mt-36 items-center">
        <FadeLoader
          color="tomato"
          // size={100}
        />
      </div>
    </div>
  );
};

export default Loading;
