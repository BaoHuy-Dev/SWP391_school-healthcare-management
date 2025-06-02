import React from 'react';

export default function SocialIcons() {
  const socialLinks = [
    {
      name: 'Facebook',
      url: '#facebook',
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/xQXZhSUCOj.png'
    },
    {
      name: 'Twitter',
      url: '#twitter',
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/R7rdtk4yCb.png'
    },
    {
      name: 'Instagram',
      url: '#instagram',
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/kTrsMfmyMp.png'
    },
    {
      name: 'LinkedIn',
      url: '#linkedin',
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/yvgzEaF0n2.png'
    }
  ];

  return (
    <div className="social-icons">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.url}
          className="social-link"
          aria-label={social.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={social.icon} alt={social.name} className="social-icon" />
        </a>
      ))}
    </div>
  );
}
