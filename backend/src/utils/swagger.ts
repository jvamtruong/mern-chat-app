import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'Chat App API Information',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./backend/routes/*.js'], // Path to the API routes
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec