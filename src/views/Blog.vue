<template>
  <div class="blog">
    <div class="container">
      <h1>{{ $t('blog.title') }}</h1>
      <p class="blog-subtitle">{{ $t('blog.subtitle') }}</p>

      <div class="blog-grid">
        <article
          v-for="article in articles"
          :key="article.id"
          class="article-card card"
          @click="$router.push(`/blog/${article.id}`)"
        >
          <img :src="article.image" :alt="article.title" class="article-image" />
          <div class="article-content">
            <div class="article-meta">
              <span class="article-date">{{ formatDate(article.date) }}</span>
              <span class="article-category">{{ locale.value === 'uk' ? (article.categoryUk || article.category) : article.category }}</span>
            </div>
            <h2 class="article-title">{{ locale.value === 'uk' ? (article.titleUk || article.title) : article.title }}</h2>
            <p class="article-excerpt">{{ locale.value === 'uk' ? (article.excerptUk || article.excerpt) : article.excerpt }}</p>
            <div class="article-footer">
              <span class="article-author">By {{ article.author }}</span>
              <span class="read-more">{{ $t('blog.readMore') }} →</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const articles = ref([
  {
    id: 1,
    title: '10 Ways to Reduce Food Waste at Home',
    titleUk: '10 способів зменшити харчові відходи вдома',
    excerpt: 'Simple tips and tricks to minimize food waste in your daily life and make a positive impact on the environment.',
    excerptUk: 'Прості поради та трюки для мінімізації харчових відходів у повсякденному житті та позитивного впливу на навколишнє середовище.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop',
    date: '2024-12-01',
    category: 'Tips',
    categoryUk: 'Поради',
    author: 'Food Share Team'
  },
  {
    id: 2,
    title: 'The Impact of Food Sharing in Our Community',
    titleUk: 'Вплив обміну їжею на нашу спільноту',
    excerpt: 'Discover how Food Share has helped save thousands of meals and connect communities across the region.',
    excerptUk: 'Дізнайтеся, як Food Share допоміг врятувати тисячі страв та об\'єднати спільноти по всьому регіону.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=500&fit=crop',
    date: '2024-11-25',
    category: 'Impact',
    categoryUk: 'Вплив',
    author: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'How Restaurants Can Benefit from Food Sharing',
    titleUk: 'Як ресторани можуть отримати вигоду від обміну їжею',
    excerpt: 'Learn how restaurants and cafes can reduce waste, save money, and contribute to their local community.',
    excerptUk: 'Дізнайтеся, як ресторани та кафе можуть зменшити відходи, заощадити гроші та внести внесок у свою місцеву спільноту.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
    date: '2024-11-15',
    category: 'Business',
    categoryUk: 'Бізнес',
    author: 'Michael Chen'
  },
  {
    id: 4,
    title: 'Sustainable Food Practices for a Better Tomorrow',
    titleUk: 'Сталі практики харчування для кращого майбутнього',
    excerpt: 'Explore sustainable food practices that can help create a more environmentally friendly future.',
    excerptUk: 'Дослідіть сталі практики харчування, які можуть допомогти створити більш екологічно чисте майбутнє.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop',
    date: '2024-11-10',
    category: 'Sustainability',
    categoryUk: 'Сталість',
    author: 'Emma Wilson'
  },
  {
    id: 5,
    title: 'Volunteer Stories: Making a Difference One Meal at a Time',
    titleUk: 'Історії волонтерів: робимо різницю по одній страві',
    excerpt: 'Heartwarming stories from volunteers who are making a real difference in their communities.',
    excerptUk: 'Зворушливі історії від волонтерів, які роблять реальну різницю у своїх спільнотах.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
    date: '2024-11-05',
    category: 'Stories',
    categoryUk: 'Історії',
    author: 'David Martinez'
  },
  {
    id: 6,
    title: 'Food Safety Guidelines for Sharing',
    titleUk: 'Правила безпеки харчування для обміну',
    excerpt: 'Important food safety guidelines to ensure that shared food is safe and healthy for everyone.',
    excerptUk: 'Важливі правила безпеки харчування для забезпечення того, щоб спільна їжа була безпечною та здоровою для всіх.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=500&fit=crop',
    date: '2024-10-28',
    category: 'Safety',
    categoryUk: 'Безпека',
    author: 'Lisa Anderson'
  }
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.blog {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.blog h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--text-primary);
  text-align: center;
}

.blog-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 48px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.article-card {
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
}

.article-card:nth-child(1) { animation-delay: 0.1s; }
.article-card:nth-child(2) { animation-delay: 0.2s; }
.article-card:nth-child(3) { animation-delay: 0.3s; }
.article-card:nth-child(4) { animation-delay: 0.4s; }
.article-card:nth-child(5) { animation-delay: 0.5s; }
.article-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.article-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image {
  transform: scale(1.1);
}

.article-content {
  padding: 24px;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.article-category {
  color: var(--accent-primary);
  font-weight: 600;
}

.article-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--text-primary);
  line-height: 1.3;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.article-author {
  color: var(--text-secondary);
}

.read-more {
  color: var(--accent-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>


