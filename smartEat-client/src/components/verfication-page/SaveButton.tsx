interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const SaveButton = ({
  onClick,
  disabled = false,
  isLoading = false,
}: SaveButtonProps) => {
  return (
    <button
      onClick={!disabled && !isLoading ? onClick : undefined}
      className={`w-[50%] ml-[25%] py-3 rounded-xl font-medium transition
        ${
          disabled || isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }
      `}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Saving..." : "Save and Continue"}
    </button>
  );
};

export default SaveButton;
