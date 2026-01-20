const redis = require('../config/redis');
const crypto = require('crypto');
const config = require('../config/config');

class CacheService {
  constructor() {
    this.defaultTTL = 3600; // 1 hour
    this.ttls = config.cache;
  }

  // Generate cache key from parameters
  generateKey(prefix, params) {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex')
      .substring(0, 8);

    return `${prefix}:${hash}`;
  }

  // Get cached data
  async get(key) {
    try {
      const data = await redis.get(key);

      if (!data) {
        console.log(`Cache MISS: ${key}`);
        return null;
      }

      console.log(`Cache HIT: ${key}`);
      return JSON.parse(data);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cached data with TTL
  async set(key, data, ttl = this.defaultTTL) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      console.log(`Cache SET: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cached data
  async del(key) {
    try {
      await redis.del(key);
      console.log(`Cache DELETE: ${key}`);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Delete all keys matching a pattern
  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Cache DELETE PATTERN: ${pattern} (${keys.length} keys)`);
      }

      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  // Cache event search results
  async cacheEventSearch(params, data) {
    const key = this.generateKey('events:search', params);
    return this.set(key, data, this.ttls.eventSearch);
  }

  // Get cached event search results
  async getCachedEventSearch(params) {
    const key = this.generateKey('events:search', params);
    return this.get(key);
  }

  // Cache event details
  async cacheEventDetail(eventId, data) {
    const key = `event:detail:${eventId}`;
    return this.set(key, data, this.ttls.eventDetail);
  }

  // Get cached event details
  async getCachedEventDetail(eventId) {
    const key = `event:detail:${eventId}`;
    return this.get(key);
  }

  // Cache recommendations
  async cacheRecommendations(params, data) {
    const key = this.generateKey('recommendations', params);
    return this.set(key, data, this.ttls.recommendations);
  }

  // Get cached recommendations
  async getCachedRecommendations(params) {
    const key = this.generateKey('recommendations', params);
    return this.get(key);
  }

  // Clear all caches
  async clearAll() {
    try {
      await redis.flushdb();
      console.log('Cache: All keys cleared');
      return true;
    } catch (error) {
      console.error('Cache clear all error:', error);
      return false;
    }
  }

  // Get cache statistics
  async getStats() {
    try {
      const info = await redis.info('stats');
      const keyspace = await redis.info('keyspace');

      return {
        info,
        keyspace,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}

// Export singleton instance
module.exports = new CacheService();
