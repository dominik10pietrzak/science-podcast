import React from 'react';
// import { Link } from 'react-router-dom';
import '../styles/paginate.scss';

interface Props {
  page: number;
  pages: number;
  keyword: string;
}

const Paginate: React.FC<Props> = ({ page, pages, keyword }) => {
  if (keyword) {
    keyword = keyword.split('?keyword=')[1].split('&')[0];
  }

  return pages > 1 ? (
    <div className='paginate'>
      {[...Array(pages).keys()].map((x) => (
        <a
          className={`page-link ${x + 1 === page ? 'active' : ''}`}
          key={x + 1}
          href={`/podcast/?keyword=${keyword}&page=${x + 1}`}>
          <span>{x + 1}</span>
        </a>
      ))}
    </div>
  ) : (
    <span></span>
  );
};

export default Paginate;
