<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Додаткова інформація</h4>
        <div class="section_heading-top-mes">
          <!-- Success message -->
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <!-- Error message -->
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <p>Desc</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormInput
          v-model="localCompany"
          placeholder="Назва компанії"
          @update:modelValue="handleCompanyChange"
        />
        <FormInput
          v-model="localPosition"
          placeholder="Ваша позиція"
          @update:modelValue="handlePositionChange"
        />
      </FormGroup>

      <FormRadioGroup title="Ваша зарплата">
        <FormRadio
          v-model="localSalaryRange"
          :options="salaryRangeOptions"
          @update:modelValue="handleSalaryRangeChange"
        />
      </FormRadioGroup>

      <FormGroup title="Які підтвердження з роботи ви можете надати орендодавцю?">
        <FormSelect
          v-model="localIncomeDocument"
          :options="incomeDocumentOptions"
          placeholder="Тип документу"
          @update:modelValue="handleIncomeDocumentChange"
        />
      </FormGroup>

      <FormRadioGroup title="Термін роботи">
        <FormRadio
          v-model="localWorkDuration"
          :options="workDurationOptions"
          @update:modelValue="handleWorkDurationChange"
        />
      </FormRadioGroup>
    </div>
  </div>
</template>

<script>
import FormSelect from '@/components/form/FormSelect.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
import FormRadio from '@/components/form/FormRadio.vue';

export default {
  name: 'FinancialInformation',
  components: {
    FormSelect,
    FormInput,
    FormGroup,
    FormRadioGroup,
    FormRadio,
  },
};
</script>

<style lang="scss" scoped>
</style>
