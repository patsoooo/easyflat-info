<template>
  <div class="container">
    <Header />
    <div class="user">
      <div class="user_data">
        <div class="user_data-photo">JW</div>
        <div class="user_data-name">
          Pan John Watson
        </div>
        <div class="user_data-desc">
          Українець, більше 10 років в Польщі
        </div>
        <ul class="user_data-social">
          <li>
            <a href="" target="_blank">
              <img src="../img/social/whatsapp.svg" alt="whatsapp">
            </a>
          </li>
          <li>
            <a href="" target="_blank">
              <img src="../img/social/tg.svg" alt="tg">
            </a>
          </li>
          <li>
            <a href="" target="_blank">
              <img src="../img/social/fb.svg" alt="fb">
            </a>
          </li>
        </ul>
      </div>
      <div class="user_section">
        <span class="user_section-title">Контакт</span>
        <ul class="user_list">
          <li class="user_info">
            <img src="../img/icons/phone.svg" alt="phone">
            <div class="user_info-data">
              <p>+48 799 098 123</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/email.svg" alt="email">
            <div class="user_info-data">
              <p>patso55ostap@gmail.com</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="user_section">
        <span class="user_section-title">Місце роботи</span>
        <ul class="user_list">
          <li class="user_info">
            <img src="../img/icons/work.svg" alt="work">
            <div class="user_info-data">
              <p>Microsoft, Software Engineer</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/email.svg" alt="email">
            <div class="user_info-data">
              <p>$8,000/місяць</p>
              <span>Дані підтверджено на основі доданого документу</span>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>Працює більше 24 місяців</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="user_section">
        <span class="user_section-title">Історія оренди</span>
        <div class="user_history">
          <span class="user_history-title">Березень 2024 - до зараз</span>
          <ul class="user_list">
            <li class="user_info">
              <img src="../img/icons/location.svg" alt="location">
              <div class="user_info-data">
                <p>Bytomska 21A</p>
                <span>Краків, Польща</span>
              </div>
            </li>
            <li class="user_info">
              <img src="../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>94% платежів надходило вчасно</p>
                <span>Дані підтверджено на основі доданих оплат з банку</span>
              </div>
            </li>
            <li class="user_info">
              <img src="../img/icons/phone.svg" alt="phone">
              <div class="user_info-data">
                <p>Номер орендодавця: +48 799 098 123</p>
              </div>
            </li>
          </ul>
          <span class="user_history-title">Жовтень 2016 - Березень 2020</span>
          <ul class="user_list">
            <li class="user_info">
              <img src="../img/icons/location.svg" alt="location">
              <div class="user_info-data">
                <p>Krośnienska 36</p>
                <span>Жешув, Польща</span>
              </div>
            </li>
            <li class="user_info">
              <img src="../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>73% платежів надходило вчасно</p>
                <span>Дані підтверджено на основі доданих оплат з банку</span>
              </div>
            </li>
            <li class="user_info">
              <img src="../img/icons/phone.svg" alt="phone">
              <div class="user_info-data">
                <p>Номер орендодавця: +48 799 098 123</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="user_section">
        <span class="user_section-title">Додаткова інформація</span>
        <ul class="user_list">
          <li class="user_info">
            <img src="../img/icons/language.svg" alt="language">
            <div class="user_info-data">
              <p>Володіння мовами: Англійська, Українська і Польська</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/email.svg" alt="email">
            <div class="user_info-data">
              <p>Домашніх тварин немає</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/phone.svg" alt="phone">
            <div class="user_info-data">
              <p>Буду знімати житло з дівчиною</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/phone.svg" alt="phone">
            <div class="user_info-data">
              <p>Не палимо</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/money.svg" alt="money">
            <div class="user_info-data">
              <p>Бюджет: до 4000зл/місяць</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>Оренда мінімум на рік</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/calendar.svg" alt="calendar">
            <div class="user_info-data">
              <p>Бажана дата заселення: 1 жовтня 2025</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../components/Header.vue';

export default {
  name: 'ViewUser',
  components: {
    Header,
  },
};
</script>
<style lang="scss">
.user {
  padding: 4.8rem 2.4rem 2.4rem;
  background-color: $bg-white;
  border-radius: 2rem;
  &_history {
    padding: 1.2rem 0;
    .user_list {
      margin-left: 3.6rem;
      position: relative;
      margin-bottom: 1.2rem;
      &:last-child {
        &::after {
          display: none;
        }
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -2.6rem;
        width: 0.16rem;
        height: 100%;
        background-color: $text-grey-1;
      }
    }
    &-title {
      display: block;
      @include text-15-medium;
      color: $text-grey-6;
      margin-left: 3.6rem;
      position: relative;
      margin-bottom: 1.2rem;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -3.6rem;
        display: inline-block;
        width: 2rem;
        height: 2rem;
        background-color: $text-grey-1;
        border-radius: 100%;
      }
    }
  }
  &_data {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4.4rem;
    &-photo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12rem;
      height: 12rem;
      border-radius: 100%;
      background-color: $bg-grey;
      margin-bottom: 1.6rem;
      @include text-24-bold;
    }
    &-name {
      @include text-24-bold;
      color: $text-black;
      margin-bottom: .8rem;
    }
    &-desc {
      @include text-15-regular;
      color: $text-grey-6;
      margin-bottom: 2.4rem;
    }
    &-social {
      display: flex;
      align-items: center;
      li {
        padding: 0 0.8rem;
      }
    }
  }
  &_section {
    padding-bottom: 0.8rem;
    border-bottom: 0.12rem solid $border-grey;
    margin-bottom: 2.8rem;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    &-title {
      display: block;
      @include text-15-medium;
      color: $text-grey-6;
      margin-bottom: .8rem;
      &.history {
        margin-top: 3.2rem;
      }
    }
  }
  &_info {
    display: flex;
    align-items: center;
    padding: 1.2rem 0;
    &-data {
      span {
        @include text-15-regular;
        color: $text-grey-6;
      }
    }
    img {
      width: 2.4rem;
      margin-right: 1.2rem;
    }
    p {
      @include text-17-medium;
      color: $text-black;
    }
  }
}
</style>
