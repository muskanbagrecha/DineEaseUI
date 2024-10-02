import AddRestaurant from '@/components/admin/addRestaurant';
import MenuPage from '@/components/admin/menu/menuPage';

export default function ManagerProfilePage() {
  // !TODO: Fetch manager data
  if (true) {
    return <MenuPage restaurantId={'66f2a39039240a0a4b9de71b'} />;
  }
  return <AddRestaurant />;
}
