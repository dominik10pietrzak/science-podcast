export const translateDescription = (desc: string) => {
  switch (desc) {
    case 'Clouds':
      desc = 'Zachmurzenie';
      break;
    case 'Clear':
      desc = 'Bezchmurnie';
      break;

    case 'Rain':
      desc = 'Opady deszczu';
      break;

    case 'Storm':
      desc = 'Burza z piorunami';
      break;

    case 'Snow':
      desc = 'Opady śniegu';
      break;
  }

  return desc;
};
