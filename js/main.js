const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart'),
modalCart = document.querySelector('#modal-cart'),
modalClose = document.querySelector('.modal-close');

const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', (event) => {
	let target = event.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal();
	}
});

// scroll smooth

(function() {
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', (event) => {
			event.preventDefault();
			const id = scrollLinks[i].getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});

		});
	}
})()

//goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodList = document.querySelector('.long-goods-list');
const offers = document.querySelectorAll('.special-offers');

const scrollUp = () => {
  document.querySelector('#body').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
const getGoods = async () => {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ошибочка вышла: ' + result.status;
  }
  return await result.json();
};

const createCard = ({ label, img, name, description, id, price }) => {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6';
  card.innerHTML = `
      <div class="goods-card">
        ${label ? `<span class="label">${label}</span>` : ''}
        <img src="db/${img}" alt="${name}" class="goods-image">
        <h3 class="goods-title">${name}</h3>
        <p class="goods-description">${description}</p>
        <button class="button goods-card-btn add-to-cart" data-id="${id}">
          <span class="button-price">$${price}</span>
        </button>
      </div>
  `;
  return card;
};
  
const renderCards = (data) => {
  const cards = data.map(createCard);
  longGoodList.textContent = "";
  longGoodList.append(...cards);
  document.body.classList.add('show-goods');
};

more.addEventListener('click', (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
  scrollUp();
});

const filterCards = (field, value) => {
  getGoods()
  .then((data) => {
    const filteredGoods = data.filter((good) => {
      return good[field] === value;
    });
    return filteredGoods;
  })
  .then(renderCards);
};


navigationLink.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
    if (value == 'All') {
      getGoods().then(renderCards);
    }
  })
});

offers.forEach((item) => {
  item.addEventListener('click', (event) => {
    let target = event.target;
    if (target.closest('div.card-1') && target.closest('button')) {
      filterCards('category', 'Accessories');
      scrollUp();
    } else if (target.closest('div.card-2') && target.closest('button')) {
      filterCards('category', 'Clothing');
      scrollUp();
    };
  });
});