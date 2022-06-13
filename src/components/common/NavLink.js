import Link from 'next/link';

export default function NavLink(props) {
  return (
    <Link {...props} prefetch={false}>
      <a
        onClick={props.onClick}
        className={props.className}
        style={props.style}
        aria-label={props.title || 'Link'}
      >
        {' '}
        {props.title && !props.hideTitle ? props.title : props.children}
      </a>
    </Link>
  );
}
