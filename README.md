1. Clone the project
2. Run `npm install`
3. Run `npm run build`
4. Replace with the `args` with `index.js` build path of your project.

```
{
  "mcpServers": {
    "currents": {
      "name": "Currents",
      "description": "Currents MCP server",
      "command": "npx",
      "args": [
        "-y",
        "/Users/miguelangarano/Documents/GitHub/currents-mcp/build/index.js" // This will change to @currents/mcp
      ],
      "env": { // This is the current way for setting env variables (see [google maps](https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps#npx) example. See [slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack#npx) example)
        "CURRENTS_API_KEY": "your-api-key",
        "CURRENTS_API_URL": "https://api-staging.currents.dev/v1" // will dissapear by default using production url
      }
    }
  }
}

```
5. Open the cursor settings and add a new mcp server
   
   <img width="707" alt="image" src="https://github.com/user-attachments/assets/a34c7b3f-b40a-4d53-a363-f243f452d835" />
6. Set the previous JSON object into the mcp config file
   
   <img width="654" alt="image" src="https://github.com/user-attachments/assets/97e464c8-6cda-4acd-bf2d-8943b792c377" />
7. Check it is active
   
   <img width="554" alt="image" src="https://github.com/user-attachments/assets/2142f958-12d4-469d-9d45-85ed0c05fd09" />
