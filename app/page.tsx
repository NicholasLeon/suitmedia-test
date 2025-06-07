import Banner from "./components/banner";
import IdeasList from "./components/list";

export default function IdeasPage() {
  return (
    <>
      <Banner
        title="Ideas"
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
      />
      <IdeasList />
    </>
  );
}
