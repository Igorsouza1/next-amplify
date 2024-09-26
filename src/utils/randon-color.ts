export const gerarCorAleatoria = () => {
    const letras = "0123456789ABCDEF";
    return `#${Array.from({ length: 6 })
      .map(() => letras[Math.floor(Math.random() * 16)])
      .join("")}`;
  };
  