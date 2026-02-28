import { TotalLine } from '../components/TotalLine';
import { Deck } from '../components/Deck';
import { ButtonBar } from '../components/ButtonBar';

export const ArticlesPage = () => {
  return (
    <>
      <div className="header-area">
        <TotalLine />
      </div>
      <div className="d-flex">
        <div className="flex-fill main-area">
          <Deck />
        </div>
        <ButtonBar />
      </div>
    </>
  );
};
