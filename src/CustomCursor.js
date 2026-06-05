import { useEffect, useRef } from 'react';

function CustomCursor() {
  const pointerRef = useRef(null);
  const glowRef = useRef(null);
  const glowPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const pointer = pointerRef.current;
    const glow = glowRef.current;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      pointer.style.left = e.clientX + 'px';
      pointer.style.top = e.clientY + 'px';
    };

    const onMouseDown = () => {
      pointer.classList.add('clicking');
    };

    const onMouseUp = () => {
      pointer.classList.remove('clicking');
    };

    const onMouseOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInteractive = ['a', 'button', 'input', 'select', 'textarea', 'label'].includes(tag)
        || e.target.closest('a, button');
      if (isInteractive) {
        pointer.classList.add('hovering');
        glow.classList.add('hovering');
      } else {
        pointer.classList.remove('hovering');
        glow.classList.remove('hovering');
      }
    };

    // Smooth glow follow
    const animate = () => {
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.15;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.15;
      glow.style.left = glowPos.current.x + 'px';
      glow.style.top = glowPos.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={pointerRef} className="cursor-pointer" />
      <div ref={glowRef} className="cursor-glow" />
    </>
  );
}

export default CustomCursor;
