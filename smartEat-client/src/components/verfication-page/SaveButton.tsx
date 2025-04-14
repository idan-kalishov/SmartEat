interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton = ({ onClick }: SaveButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-[50%] bg-green-500 text-white py-3 ml-[25%] rounded-xl font-medium hover:bg-green-600 transition"
    >
      Save and Continue
    </button>
  );
};

export default SaveButton;
