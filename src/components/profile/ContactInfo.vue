<template>
  <div class="user_section">
    <span class="user_section-title">{{ $t('create.contact.title') }}</span>

    <!-- Email -->
    <div class="form-group">
      <label for="email" class="form-label">
        {{ $t('create.contact.email') }}
      <input
        id="email"
        v-model="localEmail"
        type="email"
        class="form-input"
        :class="{ 'error': errors.email }"
        :placeholder="$t('create.contact.emailPlaceholder')"
      />
      </label>
      <div v-if="errors.email" class="form-error">
        {{ errors.email }}
      </div>
    </div>

    <!-- Phone -->
    <div class="form-group">
      <label for="phone" class="form-label">
        {{ $t('create.contact.phone') }}
      <input
        id="phone"
        v-model="localPhone"
        type="tel"
        class="form-input"
        :class="{ 'error': errors.phone }"
        :placeholder="$t('create.contact.phonePlaceholder')"
      />
      </label>
      <div v-if="errors.phone" class="form-error">
        {{ errors.phone }}
      </div>
    </div>

    <!-- Social Media Section -->
    <div class="form-group">
      <div class="form-label">
        {{ $t('create.contact.socialMedia') }}
      </div>
      <div class="form-note">
        <p>{{ $t('create.contact.socialMediaNote') }}</p>
      </div>
    </div>

    <!-- WhatsApp -->
    <div class="form-group social-group">
      <label for="whatsapp" class="form-label form-label--small">
        <img src="../../img/social/whatsapp.svg" alt="WhatsApp" class="social-icon">
        {{ $t('create.contact.whatsapp') }}
      <input
        id="whatsapp"
        v-model="localWhatsapp"
        type="url"
        class="form-input"
        :placeholder="$t('create.contact.whatsappPlaceholder')"
      />
      </label>
    </div>

    <!-- Instagram -->
    <div class="form-group social-group">
      <label for="instagram" class="form-label form-label--small">
        <img src="../../img/social/instagram.svg" alt="Instagram" class="social-icon">
        {{ $t('create.contact.instagram') }}
      <input
        id="instagram"
        v-model="localInstagram"
        type="url"
        class="form-input"
        :placeholder="$t('create.contact.instagramPlaceholder')"
      />
      </label>
    </div>

    <!-- Facebook -->
    <div class="form-group social-group">
      <label for="facebook" class="form-label form-label--small">
        <img src="../../img/social/fb.svg" alt="Facebook" class="social-icon">
        {{ $t('create.contact.facebook') }}
      <input
        id="facebook"
        v-model="localFacebook"
        type="url"
        class="form-input"
        :placeholder="$t('create.contact.facebookPlaceholder')"
      />
      </label>
    </div>

    <!-- Telegram -->
    <div class="form-group social-group">
      <label for="telegram" class="form-label form-label--small">
        <img src="../../img/social/linkedin.svg" alt="Telegram" class="social-icon">
        {{ $t('create.contact.telegram') }}
      <input
        id="telegram"
        v-model="localTelegram"
        type="url"
        class="form-input"
        :placeholder="$t('create.contact.telegramPlaceholder')"
      />
      </label>
    </div>

    <div class="form-note">
      <p>{{ $t('create.contact.note') }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ContactInfo',
  props: {
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    telegram: {
      type: String,
      default: '',
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    'update:email',
    'update:phone',
    'update:whatsapp',
    'update:instagram',
    'update:facebook',
    'update:telegram',
  ],
  setup(props, { emit }) {
    const localEmail = computed({
      get: () => props.email,
      set: (value) => emit('update:email', value),
    });

    const localPhone = computed({
      get: () => props.phone,
      set: (value) => emit('update:phone', value),
    });

    const localWhatsapp = computed({
      get: () => props.whatsapp,
      set: (value) => emit('update:whatsapp', value),
    });

    const localInstagram = computed({
      get: () => props.instagram,
      set: (value) => emit('update:instagram', value),
    });

    const localFacebook = computed({
      get: () => props.facebook,
      set: (value) => emit('update:facebook', value),
    });

    const localTelegram = computed({
      get: () => props.telegram,
      set: (value) => emit('update:telegram', value),
    });

    return {
      localEmail,
      localPhone,
      localWhatsapp,
      localInstagram,
      localFacebook,
      localTelegram,
    };
  },
};
</script>
