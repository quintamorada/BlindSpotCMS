#!/bin/bash

# ========================================
# 🚀 Script de Deploy em Produção - PM2
# ========================================
# Uso: ./deploy-production.sh
# 
# Este script irá:
# 1. Verificar pré-requisitos
# 2. Fazer backup do build anterior
# 3. Atualizar código do Git
# 4. Instalar dependências
# 5. Build da aplicação
# 6. Reiniciar/Iniciar com PM2
# ========================================

set -e  # Para execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Nome da aplicação no PM2
APP_NAME="rest-express"

# Funções auxiliares
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}==>${NC} $1"
}

# Verificar se está rodando como root (opcional)
check_root() {
    if [ "$EUID" -eq 0 ]; then 
        print_warning "Rodando como root. Recomendado usar usuário normal."
        read -p "Continuar? (s/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            exit 1
        fi
    fi
}

# Verificar se PM2 está instalado
check_pm2() {
    print_step "Verificando PM2..."
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 não encontrado!"
        print_info "Instale com: npm install -g pm2"
        exit 1
    fi
    print_success "PM2 encontrado: $(pm2 --version)"
}

# Verificar se Node.js está instalado
check_node() {
    print_step "Verificando Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado!"
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    print_success "NPM: $(npm --version)"
}

# Verificar se o arquivo .env existe
check_env() {
    print_step "Verificando arquivo .env..."
    if [ ! -f .env ]; then
        print_error "Arquivo .env não encontrado!"
        print_info "Crie um arquivo .env com as variáveis necessárias:"
        print_info "  - NODE_ENV=production"
        print_info "  - DATABASE_URL=..."
        print_info "  - SESSION_SECRET=..."
        print_info "  - PORT=5000"
        exit 1
    fi
    
    # Verificar variáveis importantes
    if ! grep -q "DATABASE_URL" .env; then
        print_warning "DATABASE_URL não encontrado no .env"
    fi
    
    if ! grep -q "SESSION_SECRET" .env; then
        print_warning "SESSION_SECRET não encontrado no .env"
        print_info "Gerando SESSION_SECRET..."
        SECRET=$(openssl rand -base64 32)
        echo "SESSION_SECRET=$SECRET" >> .env
        print_success "SESSION_SECRET gerado e adicionado ao .env"
    fi
    
    # Garantir que NODE_ENV está como production
    if grep -q "NODE_ENV=development" .env; then
        print_warning "Alterando NODE_ENV para production..."
        sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env
    elif ! grep -q "NODE_ENV" .env; then
        echo "NODE_ENV=production" >> .env
        print_success "NODE_ENV=production adicionado ao .env"
    fi
    
    print_success "Arquivo .env verificado"
}

# Fazer backup do build atual
backup_build() {
    print_step "Fazendo backup do build anterior..."
    if [ -d "dist" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_DIR="dist_backup_$TIMESTAMP"
        mv dist "$BACKUP_DIR"
        print_success "Backup criado: $BACKUP_DIR"
    else
        print_info "Nenhum build anterior encontrado"
    fi
}

# Atualizar código do repositório
git_pull() {
    print_step "Atualizando código do Git..."
    
    # Verificar se é um repositório git
    if [ ! -d .git ]; then
        print_warning "Não é um repositório Git. Pulando git pull..."
        return
    fi
    
    # Verificar branch atual
    CURRENT_BRANCH=$(git branch --show-current)
    print_info "Branch atual: $CURRENT_BRANCH"
    
    # Verificar mudanças não commitadas
    if ! git diff-index --quiet HEAD --; then
        print_warning "Existem mudanças não commitadas!"
        print_info "Fazendo stash das mudanças..."
        git stash
    fi
    
    # Pull
    if git pull; then
        print_success "Código atualizado com sucesso"
    else
        print_error "Erro ao fazer git pull"
        exit 1
    fi
}

# Instalar dependências
install_deps() {
    print_step "Instalando dependências..."
    
    # Usar npm ci em produção para instalação limpa e rápida
    if [ -f "package-lock.json" ]; then
        print_info "Usando npm ci para instalação limpa..."
        npm ci --production=false
    else
        print_info "Usando npm install..."
        npm install
    fi
    
    print_success "Dependências instaladas"
}

# Build da aplicação
build_app() {
    print_step "Fazendo build da aplicação..."
    
    if npm run build; then
        print_success "Build concluído com sucesso"
    else
        print_error "Erro durante o build"
        exit 1
    fi
}

# Verificar se a aplicação já está rodando no PM2
check_pm2_app() {
    pm2 describe "$APP_NAME" &> /dev/null
    return $?
}

# Iniciar ou reiniciar aplicação no PM2
deploy_pm2() {
    print_step "Deployando no PM2..."
    
    if check_pm2_app; then
        print_info "Aplicação já existe. Reiniciando..."
        pm2 reload "$APP_NAME" --update-env
        print_success "Aplicação reiniciada"
    else
        print_info "Iniciando aplicação pela primeira vez..."
        pm2 start ecosystem.config.cjs
        print_success "Aplicação iniciada"
    fi
    
    # Salvar configuração do PM2
    pm2 save
    print_success "Configuração do PM2 salva"
}

# Verificar se a aplicação está rodando
verify_app() {
    print_step "Verificando status da aplicação..."
    
    sleep 3  # Aguardar alguns segundos para a aplicação iniciar
    
    if check_pm2_app; then
        pm2 describe "$APP_NAME" | grep -E "status|uptime|memory|cpu"
        print_success "Aplicação está rodando!"
    else
        print_error "Aplicação não está rodando!"
        print_info "Veja os logs com: pm2 logs $APP_NAME"
        exit 1
    fi
}

# Mostrar logs recentes
show_logs() {
    print_step "Últimas linhas dos logs..."
    pm2 logs "$APP_NAME" --lines 20 --nostream
}

# Limpar builds antigos (manter apenas os 3 mais recentes)
cleanup_old_backups() {
    print_step "Limpando backups antigos..."
    
    # Contar backups
    BACKUP_COUNT=$(ls -d dist_backup_* 2>/dev/null | wc -l)
    
    if [ "$BACKUP_COUNT" -gt 3 ]; then
        print_info "Removendo backups antigos (mantendo os 3 mais recentes)..."
        ls -dt dist_backup_* | tail -n +4 | xargs rm -rf
        print_success "Backups antigos removidos"
    else
        print_info "Nenhum backup antigo para remover"
    fi
}

# Configurar PM2 para iniciar no boot (opcional)
setup_startup() {
    print_step "Configurar PM2 para iniciar no boot do sistema?"
    read -p "Deseja configurar? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        pm2 startup
        print_info "Execute o comando sugerido acima como sudo"
        pm2 save
        print_success "PM2 salvo para iniciar no boot"
    fi
}

# Função principal
main() {
    clear
    echo -e "${GREEN}"
    echo "=========================================="
    echo "🚀 Deploy em Produção - PM2"
    echo "=========================================="
    echo -e "${NC}"
    
    # Verificações
    check_root
    check_node
    check_pm2
    check_env
    
    # Confirmação
    print_warning "Isso irá atualizar a aplicação em produção!"
    read -p "Continuar com o deploy? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_info "Deploy cancelado"
        exit 0
    fi
    
    # Processo de deploy
    backup_build
    git_pull
    install_deps
    build_app
    deploy_pm2
    verify_app
    cleanup_old_backups
    
    # Sucesso!
    echo -e "\n${GREEN}=========================================="
    echo "✓ Deploy concluído com sucesso!"
    echo "==========================================${NC}\n"
    
    print_info "Comandos úteis:"
    print_info "  Ver status:  pm2 status"
    print_info "  Ver logs:    pm2 logs $APP_NAME"
    print_info "  Reiniciar:   pm2 restart $APP_NAME"
    print_info "  Parar:       pm2 stop $APP_NAME"
    
    # Perguntar se quer configurar startup
    if ! pm2 describe "$APP_NAME" | grep -q "startup"; then
        echo
        setup_startup
    fi
    
    # Mostrar logs recentes
    echo
    read -p "Deseja ver os logs da aplicação? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        show_logs
    fi
}

# Executar
main
