export const translateDescription = (desc: string) => {
  switch (desc) {
    case 'Clouds':
      desc = 'Chmury';
      break;
    case 'Clear':
      desc = 'Słońce';
      break;

    case 'Rain':
      desc = 'Deszcz';
      break;

    case 'Storm':
      desc = 'Burza';
      break;

    case 'Snow':
      desc = 'Śnieg';
      break;
  }

  return desc;
};
