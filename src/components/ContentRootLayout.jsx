import React from 'react'

function ContentRootLayout({children}) {
  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {children}
    </div>
  );
}

export default ContentRootLayout