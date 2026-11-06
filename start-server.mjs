import { createServer } from 'vite';

try {
  const server = await createServer({
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
    },
  });

  await server.listen();
  server.printUrls();
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
