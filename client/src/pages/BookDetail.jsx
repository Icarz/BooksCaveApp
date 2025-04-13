import { useParams } from "react-router-dom";

function BookDetail() {
  const { id } = useParams();
  return <h2>Book Detail for: {id}</h2>;
}
export default BookDetail;
