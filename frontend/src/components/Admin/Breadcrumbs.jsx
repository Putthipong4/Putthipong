import React from 'react';
import { useNavigate } from 'react-router-dom';

function Breadcrumbs({ items = [] }) {
  const navigate = useNavigate();

  return (
    <div className="breadcrumbs text-sm mb-4 kanit-medium">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <a onClick={() => navigate(item.path)}>{item.label}</a>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
