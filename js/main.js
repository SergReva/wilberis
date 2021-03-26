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
  modalClose = document.querySelector('.modal-close'),
  more = document.querySelector('.more'),
  navigationLink = document.querySelectorAll('.navigation-link'),
  longGoodList = document.querySelector('.long-goods-list'),
  offers = document.querySelectorAll('.special-offers'),
  cartTableGoods = document.querySelector('.cart-table__goods'),
  cardTableTotal = document.querySelector('.card-table__total'),
  cartTableClr = document.querySelector('.modal-btn-clear'),
  cartCount = document.querySelector('.cart-count');

const getGoods = async () => {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ошибочка вышла: ' + result.status;
  }
  return await result.json();
};

const cart = {
  cartGoods: [],
  renderCart(){
    cartTableGoods.textContent = '';
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement('tr');
      trGood.className = 'cart-item';
      trGood.dataset.id = id;

      trGood.innerHTML = `
      <td>${name}</td>
      <td>${price}$</td>
      <td><button class="cart-btn-minus" data-id="${id}">-</button></td>
      <td>${count}</td>
      <td><button class="cart-btn-plus" data-id="${id}">+</button></td>
      <td>${price * count}$</td>
      <td><button class="cart-btn-delete" data-id="${id}">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });

    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);

    cardTableTotal.textContent = totalPrice + '$';
    this.cartCounter();
  },
  cartCounter(){
    cartCount.innerHTML = this.cartGoods.length;
    if (this.cartGoods.length < 1) {
      cartCount.innerHTML = '';
    }
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter(item => id !== item.id);
    this.renderCart();
  },
  cartClear(){
    this.cartGoods = [];
    this.renderCart();
  },
  minusGood(id) {
    for(const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
  },
  plusGood(id) {
    for(const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
  },
  addCartGoods(id){
    const goodItem = this.cartGoods.find(item => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then(data => data.find(item => item.id === id))
        .then(({ id, name, price, count }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
          this.cartCounter();
        });
        
    }
    
  },
}

cartTableClr.addEventListener('click', () => {
  cart.cartClear();
});

document.body.addEventListener('click', event => {
  const addToCard = event.target.closest('.add-to-cart');

  if (addToCard) {
    cart.addCartGoods(addToCard.dataset.id);
  }
})

cartTableGoods.addEventListener('click', event => {
  const target = event.target;

  if (target.tagName === 'BUTTON') {
    const id = target.closest('.cart-item').dataset.id;

    if (target.classList.contains('cart-btn-delete')) {
      cart.deleteGood(id);
    };

    if (target.classList.contains('cart-btn-plus')) {
      cart.plusGood(id);
    };

    if (target.classList.contains('cart-btn-minus')) {
      cart.minusGood(id);
    };
  }

})

const openModal = () => {
  cart.renderCart();
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
		scrollLinks[i].addEventListener('click', event => {
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



const scrollUp = () => {
  document.querySelector('#body').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


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

more.addEventListener('click', event => {
  event.preventDefault();
  getGoods().then(renderCards);
  scrollUp();
});

const filterCards = (field, value) => {
  getGoods()
  .then((data) => data.filter(good => good[field] === value))
  .then(renderCards);
};


navigationLink.forEach((link) => {
  link.addEventListener('click', event => {
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


//server

const modalForm = document.querySelector('.modal-form');
const userName = document.querySelector('.user-name');
const userTel = document.querySelector('.user-tel');

const postData = dataUser => fetch('server.php', {
  method: 'POST',
  body: dataUser,
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();

  if (userName.value === '' || userTel.value === '' || userName.value.length < 3) {
    console.error('Имя или номер телефона не введены');
  } else if (cart.cartGoods.length === 0) {
    console.error('Корзина не может быть пустой');
  } else {

    const formData = new FormData(modalForm); //спец класс в JS

    formData.append('cart', JSON.stringify(cart.cartGoods));
    
  
    postData(formData)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        alert('Ваша заявка успешно отправлена, с вами свяжуться в ближайшее время');
        console.log(response.status);       
      })
      .catch(err => {
        alert('К сожалению произошла ошибка');
        console.log(err);
      })
      .finally(() => {
        closeModal();
        modalForm.reset();
        cart.cartGoods.length = 0;
        cart.renderCart();
      });
  }

  
});