
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
  priceId: string;
  productId: string;
}

const StripeConfigPage = () => {
  const [config, setConfig] = useState<StripeConfig>({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    testMode: true,
    priceId: '',
    productId: ''
  });
  
  const [showSecrets, setShowSecrets] = useState({
    secretKey: false,
    webhookSecret: false
  });
  
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);

  // URL do webhook que deve ser configurada no Stripe
  const webhookUrl = `https://erfuinkfouijxgfkxhhn.supabase.co/functions/v1/stripe-webhook`;

  const handleInputChange = (field: keyof StripeConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'testMode' ? event.target.checked : event.target.value;
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSecretVisibility = (field: 'secretKey' | 'webhookSecret') => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copiado para a área de transferência!`);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      toast.error('Erro ao copiar para a área de transferência');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aqui você salvaria as configurações - por enquanto apenas simulando
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações do Stripe salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const validateStripeKey = (key: string, type: 'publishable' | 'secret') => {
    if (!key) return false;
    
    if (type === 'publishable') {
      return key.startsWith('pk_');
    } else {
      return key.startsWith('sk_');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        Configurações do Stripe
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure suas chaves e webhooks do Stripe para processar pagamentos
      </p>

      <div className="space-y-6">
        {/* Configurações Básicas */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Configurações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="testMode"
                checked={config.testMode}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, testMode: checked }))}
              />
              <Label htmlFor="testMode" className="flex items-center gap-2 dark:text-white">
                Modo de Teste
                <Badge variant={config.testMode ? "secondary" : "default"}>
                  {config.testMode ? "TEST" : "LIVE"}
                </Badge>
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publishableKey" className="dark:text-white">
                  Chave Publicável (Publishable Key)
                </Label>
                <Input
                  id="publishableKey"
                  value={config.publishableKey}
                  onChange={handleInputChange('publishableKey')}
                  placeholder={config.testMode ? "pk_test_..." : "pk_live_..."}
                  className={`mt-1 ${
                    config.publishableKey !== '' && !validateStripeKey(config.publishableKey, 'publishable')
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {config.publishableKey !== '' && !validateStripeKey(config.publishableKey, 'publishable')
                    ? "Chave publicável inválida"
                    : "Esta chave é segura para usar no frontend"
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="secretKey" className="dark:text-white">
                  Chave Secreta (Secret Key)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="secretKey"
                    type={showSecrets.secretKey ? "text" : "password"}
                    value={config.secretKey}
                    onChange={handleInputChange('secretKey')}
                    placeholder={config.testMode ? "sk_test_..." : "sk_live_..."}
                    className={`pr-10 ${
                      config.secretKey !== '' && !validateStripeKey(config.secretKey, 'secret')
                        ? 'border-red-500'
                        : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecretVisibility('secretKey')}
                  >
                    {showSecrets.secretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {config.secretKey !== '' && !validateStripeKey(config.secretKey, 'secret')
                    ? "Chave secreta inválida"
                    : "Mantenha esta chave segura e privada"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Webhook */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Configuração de Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Importante:</strong> Configure este endpoint no seu Dashboard do Stripe para receber eventos de pagamento.
              </AlertDescription>
            </Alert>

            <div>
              <Label className="dark:text-white text-sm font-medium">
                URL do Webhook:
              </Label>
              <div className="flex items-center gap-2 mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <code className="flex-1 text-sm font-mono dark:text-white break-all">
                  {webhookUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(webhookUrl, 'URL do Webhook')}
                >
                  {copied === 'URL do Webhook' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="webhookSecret" className="dark:text-white">
                Webhook Secret
              </Label>
              <div className="relative mt-1">
                <Input
                  id="webhookSecret"
                  type={showSecrets.webhookSecret ? "text" : "password"}
                  value={config.webhookSecret}
                  onChange={handleInputChange('webhookSecret')}
                  placeholder="whsec_..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleSecretVisibility('webhookSecret')}
                >
                  {showSecrets.webhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Secret do webhook fornecido pelo Stripe para validar requisições
              </p>
            </div>

            <div>
              <Label className="dark:text-white text-sm font-medium mb-2 block">
                Eventos necessários no Stripe:
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  'customer.subscription.created',
                  'customer.subscription.updated',
                  'customer.subscription.deleted',
                  'payment_intent.succeeded',
                  'payment_intent.payment_failed'
                ].map((event) => (
                  <Badge key={event} variant="outline" className="text-xs">
                    {event}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos e Preços */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Produtos e Preços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productId" className="dark:text-white">
                  Product ID
                </Label>
                <Input
                  id="productId"
                  value={config.productId}
                  onChange={handleInputChange('productId')}
                  placeholder="prod_..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ID do produto criado no Stripe
                </p>
              </div>

              <div>
                <Label htmlFor="priceId" className="dark:text-white">
                  Price ID
                </Label>
                <Input
                  id="priceId"
                  value={config.priceId}
                  onChange={handleInputChange('priceId')}
                  placeholder="price_..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ID do preço/plano de assinatura no Stripe
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links Úteis */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Links Úteis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                asChild
                className="h-auto py-3"
              >
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  Chaves da API
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-auto py-3"
              >
                <a
                  href="https://dashboard.stripe.com/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  Webhooks
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-auto py-3"
              >
                <a
                  href="https://dashboard.stripe.com/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  Produtos
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-auto py-3"
              >
                <a
                  href="https://dashboard.stripe.com/test/logs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  Logs
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end mt-6">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default StripeConfigPage;
