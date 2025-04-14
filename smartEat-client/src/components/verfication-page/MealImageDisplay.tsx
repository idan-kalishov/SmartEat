interface MealImageDisplayProps {
  mealImage: string;
  mealName: string;
}

const MealImageDisplay = ({ mealImage, mealName }: MealImageDisplayProps) => {
  return (
    <div className="flex justify-center mb-4">
      <img
        src={mealImage}
        alt={`${mealName} image`}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md"
      />
    </div>
  );
};

export default MealImageDisplay;
