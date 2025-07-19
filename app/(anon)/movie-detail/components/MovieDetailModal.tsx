import Modal from "@/app/components/Modal";
import MoviePreviewInfo from "./MoviePreviewInfo";
import MovieReviewList from "./MovieReviewList";

interface ModalProps {
  setModal: () => void;
}

const MovieDetailModal = ({ setModal }: ModalProps) => {
  return (
    <Modal setModal={setModal}>
      <MoviePreviewInfo
        info={{
          releaseDate: "2025.06.22",
          rating: "12세 이상 관람가",
          genre: "드라마, 액션",
          country: "미국",
          runningTime: "155분",
        }}
      />
      <MovieReviewList />
    </Modal>
  );
};

export default MovieDetailModal;
