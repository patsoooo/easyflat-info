<template>
  <div class="container-xl">
    <Header />
  </div>
  <div class="container">
    <Gradient />

    <!-- Завантаження -->
    <div v-if="loading" class="loading">
      Завантаження...
    </div>

    <!-- Помилка -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Дані користувача -->
    <div v-else class="user">
      <div class="user_data">
        <div class="user_data-photo">{{ userData?.initials || 'N/A' }}</div>
        <div class="user_data-name">
          {{ userData?.name || 'Немає інформації' }}
        </div>
        <div class="user_data-desc">
          {{ userData?.description || 'Немає інформації' }}
        </div>
        <ul class="user_data-social">
          <li>
            <a href="" target="_blank">
              <img src="../img/social/whatsapp.svg" alt="whatsapp">
            </a>
          </li>
          <li>
            <a href="" target="_blank">
              <img src="../img/social/instagram.svg" alt="instagram">
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
              <p>{{ userData?.contact?.[0]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/email.svg" alt="email">
            <div class="user_info-data">
              <p>{{ userData?.contact?.[1]?.value || 'Немає інформації' }}</p>
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
              <p>{{ userData?.workplace?.[0]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/money.svg" alt="money">
            <div class="user_info-data">
              <p>{{ userData?.workplace?.[1]?.value || 'Немає інформації' }}</p>
              <span v-if="userData?.workplace?.[1]?.description">
                {{ userData.workplace[1].description }}</span>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>{{ userData?.workplace?.[2]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="user_section">
        <span class="user_section-title">Історія оренди</span>
        <div class="user_history">
          <div v-if="userData?.rentalHistory?.length > 0">
            <div v-for="(period, index) in userData.rentalHistory"
            :class="{ 'user_history-last': index === userData.rentalHistory.length - 1 }"
            :key="index">
              <span class="user_history-title">{{ period?.period || 'Невідомий період' }}</span>
              <ul class="user_list">
                <li class="user_info">
                  <img src="../img/icons/location.svg" alt="location">
                  <div class="user_info-data">
                    <p>{{ period?.items?.[0]?.value || 'Немає інформації' }}</p>
                    <span v-if="period?.items?.[0]?.description">
                      {{ period.items[0].description }}</span>
                  </div>
                </li>
                <li class="user_info">
                  <img src="../img/icons/money.svg" alt="money">
                  <div class="user_info-data">
                    <p>{{ period?.items?.[1]?.value || 'Немає інформації' }}</p>
                    <span v-if="period?.items?.[1]?.description">
                      {{ period.items[1].description }}</span>
                  </div>
                </li>
                <li class="user_info">
                  <img src="../img/icons/phone.svg" alt="phone">
                  <div class="user_info-data">
                    <p>{{ period?.items?.[2]?.value || 'Немає інформації' }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <span class="user_history-title">Немає інформації про оренду</span>
          </div>
        </div>
      </div>

      <div class="user_section">
        <span class="user_section-title">Додаткова інформація</span>
        <ul class="user_list">
          <li class="user_info">
            <img src="../img/icons/language.svg" alt="language">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[0]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/pets.svg" alt="pets">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[1]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/flatmates.svg" alt="flatmates">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[2]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/smoke.svg" alt="smoke">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[3]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/money.svg" alt="money">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[4]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[5]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
          <li class="user_info">
            <img src="../img/icons/calendar.svg" alt="calendar">
            <div class="user_info-data">
              <p>{{ userData?.additionalInfo?.[6]?.value || 'Немає інформації' }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserByUsername } from '@/services/userService';
import Header from '../components/Header.vue';
import Gradient from '../components/Gradient.vue';

export default {
  name: 'ViewUser',
  components: {
    Header,
    Gradient,
  },
  setup() {
    const route = useRoute();

    // Реактивні змінні
    const userData = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // Функція завантаження користувача
    const loadUser = async () => {
      try {
        loading.value = true;
        error.value = null;

        const { username } = route.params;

        if (!username) {
          error.value = 'Username не вказано';
          return;
        }

        console.log('Завантаження користувача:', username);
        const user = await getUserByUsername(username);

        if (user) {
          userData.value = user;
          console.log('Користувач завантажений:', user);
        } else {
          console.log('Користувача не знайдено, але показуємо сторінку');
          userData.value = {}; // Порожній об'єкт щоб показати сторінку
        }
      } catch (err) {
        console.error('Помилка завантаження користувача:', err);
        userData.value = {}; // Показуємо сторінку з fallback даними
      } finally {
        loading.value = false;
      }
    };

    // Викликаємо завантаження при монтуванні компонента
    onMounted(() => {
      loadUser();
    });

    // Повертаємо все, що потрібно в template
    return {
      userData,
      loading,
      error,
      loadUser,
    };
  },
};
</script>

<style lang="scss">
.loading, .error {
  padding: 2rem;
  text-align: center;
  background-color: $bg-white;
  border-radius: 2rem;
  margin-top: 2rem;
}

.error {
  color: #e74c3c;
}

.user {
  margin-bottom: 2rem;
  &_history {
    padding: 1.2rem 0;
    .user_list {
      margin-left: 3.6rem;
      position: relative;
      margin-bottom: 1.2rem;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -2.6rem;
        width: 0.16rem;
        height: 100%;
        background: $border-grey;
        border-radius: 10rem;
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
        border: 0.16rem solid $border-grey;
        border-radius: 100%;
      }
    }
    .user_history-last {
      .user_list {
        &::after {
          content: none;
        }
      }
    }
  }
  &_data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.4rem 0;
    margin-bottom: 1.6rem;
    &-photo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12rem;
      height: 12rem;
      border-radius: 100%;
      background: rgba(0, 0, 0, 0.06);
      margin-bottom: 1.6rem;
      @include text-24-bold;
    }
    &-name {
      @include text-24-bold;
      color: $text-black;
      margin-bottom: .4rem;
    }
    &-desc {
      @include text-15-regular;
      color: $text-grey-6;
      margin-bottom: 2rem;
    }
    &-social {
      display: flex;
      align-items: center;
      li {
        padding: 0 0.8rem;
        a {
          width: 3.2rem;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  &_section {
    padding: 1.6rem 1.6rem 1.2rem 2rem;
    background-color: $bg-white;
    border: .08rem solid $border-grey;
    border-radius: 1.6rem;
    margin-bottom: 1.6rem;
    &:last-child {
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
        @include text-13-regular;
        color: $text-grey-6;
      }
    }
    img {
      width: 2.4rem;
      margin-right: 1.2rem;
    }
    p {
      @include text-15-medium;
      color: $text-black;
    }
  }
}
</style>
