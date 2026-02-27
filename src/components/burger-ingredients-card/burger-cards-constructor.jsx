import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

function BurgerCardConstructor({ data }) {
  if (data.item.type == 'bun' && data.bun_part == 'top') {
    return (
      <ConstructorElement
        handleClose={function fee() {
          console.log('top bun');
        }}
        isLocked
        price={data.item.price}
        text={data.item.name + ' (верх)'}
        thumbnail={data.item.image_mobile}
        type="top"
      />
    );
  }

  if (data.item.type == 'bun' && data.bun_part == 'bottom') {
    return (
      <ConstructorElement
        handleClose={function fee() {
          console.log('bottom bun');
        }}
        isLocked
        price={data.item.price}
        text={data.item.name + ' (низ)'}
        thumbnail={data.item.image_mobile}
        type="bottom"
      />
    );
  }

  return (
    <ConstructorElement
      handleClose={function fee() {
        console.log('other');
      }}
      isLocked={false}
      price={data.item.price}
      text={data.item.name}
      thumbnail={data.item.image_mobile}
    />
  );
}

export default BurgerCardConstructor;
