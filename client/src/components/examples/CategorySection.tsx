import CategorySection from '../CategorySection';
import img1 from "@assets/stock_images/roller_blinds_vertic_09ed5e02.jpg";
import img2 from "@assets/stock_images/roller_blinds_vertic_6e1dd772.jpg";
import img3 from "@assets/stock_images/blackout_curtains_be_a141c3c1.jpg";
import img4 from "@assets/stock_images/window_blinds_modern_f03f816b.jpg";

export default function CategorySectionExample() {
  const categories = [
    {
      id: "1",
      name: "Blackout",
      description: "Bloqueio total de luz",
      image: img3
    },
    {
      id: "2",
      name: "Rolô",
      description: "Praticidade e elegância",
      image: img1
    },
    {
      id: "3",
      name: "Vertical",
      description: "Ideal para grandes janelas",
      image: img2
    },
    {
      id: "4",
      name: "Horizontal",
      description: "Clássicas e versáteis",
      image: img4
    }
  ];
  
  return <CategorySection categories={categories} />;
}
