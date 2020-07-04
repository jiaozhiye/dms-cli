<template>
  <div>{{ title }}</div>
</template>

<script>
import { language } from '@/mixins/langMixin';

import config from '@/config';
import { get_vDealerName } from '@/utils/cookies';

export default {
  mixins: [language],
  computed: {
    title() {
      return `© ${get_vDealerName() || config.systemName}`;
    }
  }
};
</script>
