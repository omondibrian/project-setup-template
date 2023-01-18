import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);


import {
    OpenAPIRegistry,
    OpenAPIGenerator,
  } from '@asteasolutions/zod-to-openapi';
  
  const registry = new OpenAPIRegistry();
  
  // Register definitions here
  
  const generator = new OpenAPIGenerator(registry.definitions, '3.0.0');
  
   generator.generateComponents();

   export default registry;