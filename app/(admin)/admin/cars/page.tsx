import CarsList from "./_components/CarsList";

export const metadata = {
  title: "Cars | Vehiql Admin",
  description: "Manage cars in your marketplace",
};

const CarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="P-bold-24 mb-6">Cars Management</h1>
      <CarsList />
    </div>
  )
}

export default CarsPage