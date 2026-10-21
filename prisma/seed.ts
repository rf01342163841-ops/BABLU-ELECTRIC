import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_DELIVERY_ZONES, INITIAL_COUPONS } from '../src/data/mockDatabase';

async function main() {
  console.log('Seeding MyShop BD database for Bangladesh market...');
  console.log(`- Loaded ${INITIAL_PRODUCTS.length} curated products`);
  console.log(`- Configured ${INITIAL_DELIVERY_ZONES.length} delivery zones (Dhaka, Sub-Dhaka, Nationwide)`);
  console.log(`- Generated ${INITIAL_COUPONS.length} promotional coupons`);
  console.log(`- Store hotline set to: ${INITIAL_SETTINGS.hotline}`);
  console.log('Database seeding completed successfully.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
