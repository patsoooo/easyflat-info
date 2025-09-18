<template>
  <div class="preview">
    <div class="preview_tablet">
      <div class="preview_gradient"></div>
      <div class="user">
        <div class="user_data">
          <div class="user_data-photo">NA</div>
          <div class="user_data-name">
            John Watson
          </div>
          <div class="user_data-desc">
            Іноземець, від 2 до 4 років в Польщі
          </div>

          <ul class="user_data-social">
            <li >
              <a target="_blank">
                <img src="../../img/social/whatsapp.svg" alt="whatsapp">
              </a>
            </li>
            <li >
              <a target="_blank">
                <img src="../../img/social/instagram.svg" alt="instagram">
              </a>
            </li>
            <li>
              <a target="_blank">
                <img src="../../img/social/fb.svg" alt="facebook">
              </a>
            </li>
            <li >
              <a target="_blank">
                <img src="../../img/social/linkedin.svg" alt="telegram">
              </a>
            </li>
          </ul>
        </div>

        <!-- Контакт - показуємо тільки якщо є телефон або email -->
        <div class="user_section">
          <span class="user_section-title">Контакт</span>
          <ul class="user_list">
            <li class="user_info">
              <img src="../../img/icons/phone.svg" alt="phone">
              <div class="user_info-data">
                <p>+48000999111</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/email.svg" alt="email">
              <div class="user_info-data">
                <p>user@example.com</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Місце роботи -->
        <div class="user_section">
          <span class="user_section-title">Місце роботи</span>
          <ul class="user_list">
            <li class="user_info">
              <img src="../../img/icons/work.svg" alt="work">
              <div class="user_info-data">
                <p>Microsoft, Software Engineer</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>7000–9000 zł/місяць</p>
                <span>
                  Орендар надасть довідку про зарплату
                </span>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>працює від 3 до 5 років</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Історія оренди -->
        <div class="user_section">
          <span class="user_section-title">Історія оренди</span>
          <div class="user_history">
            <div >
              <span class="user_history-title">Березень 2024 - до зараз</span>
              <ul class="user_list">
                <li class="user_info">
                  <img src="../../img/icons/location.svg" alt="location">
                  <div class="user_info-data">
                    <p>Osiedle Avia 1B</p>
                    <span>Краків, Польща</span>
                  </div>
                </li>
                <li class="user_info">
                  <img src="../../img/icons/phone.svg" alt="phone">
                  <div class="user_info-data">
                    <p>Номер орендодавця: +48 799 098 123</p>
                  </div>
                </li>
                <li class="user_info">
                  <img src="../../img/icons/money.svg" alt="money">
                  <div class="user_info-data">
                    <p>Орендар може надати банківські підтвердження платежів за оренду</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

  <!-- Додаткова інформація - показуємо тільки якщо є хоча б одне поле -->
        <div class="user_section">
          <span class="user_section-title">Додаткова інформація</span>
          <ul class="user_list">
            <li class="user_info">
              <img src="../../img/icons/language.svg" alt="language">
              <div class="user_info-data">
                <p>Володіння мовами: Англійська, Українська і Польська</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/pets.svg" alt="pets">
              <div class="user_info-data">
                <p>Орендар має домашніх тварин</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/flatmates.svg" alt="flatmates">
              <div class="user_info-data">
                <p>Орендар шукає житло з партнером</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/smoke.svg" alt="smoke">
              <div class="user_info-data">
                <p>Не палить</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>Бюджет: 3500–4500 zł/місяць</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>Оренда мінімум на рік</p>
              </div>
            </li>
            <li class="user_info">
              <img src="../../img/icons/calendar.svg" alt="calendar">
              <div class="user_info-data">
                <p>Бажана дата заселення: 1 жовтня 2025</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PreviewProfile',
};
</script>
<style lang="scss">
.preview {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.10);
  border-radius: 2rem;
  padding: 3.2rem 2rem;
  &_tablet {
    width: 32rem;
    height: 64rem;
    border-radius: 3.6rem;
    border: .4rem solid $border-black;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;
    position: relative;
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
  &_gradient {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 20rem;
    background: linear-gradient(180deg, #C8DEFD 0%, #fff 100%);
  }
}
</style>
